export async function getList() {
  const res = [
    {
      title: 'config1',
      files: ['cp2k.inp'],
      id: '1',
    },
    {
      title: 'config2',
      files: [],
      id: '2',
    },
  ];
  return res;
}

export async function getDetail(id?: string) {
  console.log(id)
  const files = [
    {
      fileName: 'artifact.yml',
      code: `artifacts:
      h2o-64-validation:
        url: /data/home/whxu/data/water/label
        includes: validation.xyz
    
      h2o-64-train:
        url: /data/home/whxu/data/water/train
    
      h2o-64-explore:
        url: /data/home/whxu/data/water/explore
        includes: POSCAR-0000
    `,
    },
    {
      fileName: 'executor.yml',
      code: `executors:
      chenglab:
        ssh:
          host: whxu@172.27.127.191:6666
          # gateway:
          #   host: whxu@10.24.3.144
    
        queue_system:
          slurm: {}
        work_dir: /data/home/whxu/ai2-kit/workdir
        python_cmd: /data/whxu/conda/env/py39/bin/python
    
        context:
          train:
            deepmd:
              script_template:
                header: |
                  #SBATCH -N 1
                  #SBATCH --ntasks-per-node=4
                  #SBATCH --job-name=deepmd
                  #SBATCH --partition=gpu3
                  #SBATCH --gres=gpu:1
                  #SBATCH --mem=8G
                setup: |
                  set -e
                  module load deepmd/2.2
                  export OMP_NUM_THREADS=1
                  set +e
    
          explore:
            lasp:
              lasp_cmd: lasp
              concurrency: 1
              script_template:
                header: |
                  #SBATCH -N 1
                  #SBATCH --ntasks-per-node=4
                  #SBATCH --job-name=lasp
                  #SBATCH --partition=gpu3
                  #SBATCH --gres=gpu:1
                  #SBATCH --mem=16G
                setup: |
                  set -e
                  module load lasphub/3.4.5
                  module load deepmd/2.1
                  set +e
    
            lammps:
              lammps_cmd: lmp_mpi
              concurrency: 1
              script_template:
                header: |
                  #SBATCH -N 1
                  #SBATCH --ntasks-per-node=4
                  #SBATCH --job-name=lammps
                  #SBATCH --partition=gpu3
                  #SBATCH --gres=gpu:1
                  #SBATCH --mem=24G
                setup: |
                  set -e
                  module load deepmd/2.2
                  export OMP_NUM_THREADS=1
                  export TF_INTRA_OP_PARALLELISM_THREADS=1
                  export TF_INTER_OP_PARALLELISM_THREADS=1
                  set +e
    
          label:
            cp2k:
              cp2k_cmd: mpiexec.hydra -env I_MPI_EXTRA_FILESYSTEM on -env I_MPI_EXTRA_FILESYSTEM_LIST gpfs cp2k.popt
    
              concurrency: 1
              script_template:
                header: |
                  #SBATCH -N 1
                  #SBATCH --ntasks-per-node=16
                  #SBATCH -t 12:00:00
                  #SBATCH --job-name=cp2k
                  #SBATCH --partition=c52-medium
                setup: |
                  set -e
                  module load intel/17.5.239 mpi/intel/2017.5.239
                  module load gcc/5.5.0
                  module load cp2k/7.1
                  set +e
    `,
    },
    {
      fileName: 'workflow.yml',
      code: `workflow:
      general:
        type_map: [ H, O ]
        mass_map: [ 1.008, 15.999 ]
        max_iters: 2
        update_explore_systems: true
    
      train:
        deepmd:
          model_num: 4
          init_dataset: [ h2o-64-train ]
          input_template:
            model:
              descriptor:
                type: se_a  # modify according to your system
                sel:
                - 100
                - 100
                rcut_smth: 0.5
                rcut: 5.0
                neuron:
                - 25
                - 50
                - 100
                resnet_dt: false
                axis_neuron: 16
                seed: 1
              fitting_net:
                neuron:
                - 240
                - 240
                - 240
                resnet_dt: true
                seed: 1
            learning_rate:
              type: exp
              start_lr: 0.001
              decay_steps: 2000
            loss:
              start_pref_e: 0.02
              limit_pref_e: 2
              start_pref_f: 1000
              limit_pref_f: 1
              start_pref_v: 0
              limit_pref_v: 0
            training:
              numb_steps: 10000
              seed: 1
              disp_file: lcurve.out
              disp_freq: 1000
              save_freq: 1000
              save_ckpt: model.ckpt
              disp_training: true
              time_training: true
              profiling: false
              profiling_file: timeline.json
    
      label:
        cp2k:
          init_system_files: [ h2o-64-validation ]
          limit: 10
          input_template: !load_text ./config/cp2k.inp
          wfn_warmup_template: !load_text ./config/cp2k.inp
    
      explore:
        # lasp:
        #   input_template:
        #     SSW.SSWsteps: 50
        #     SSW.output: T
        #     SSW.ds_atom: 0.6
        #   system_files: [ h2o-64-explore ]
    
        #   potential:
        #     lammps: {}
    
        lammps:
          timestep: 0.0005
          sample_freq: 100
          nsteps: 2000
          ensemble: nvt
    
          system_files: [ h2o-64-explore ]
    
          explore_vars:
            TEMP: [ 330, ]
            PRES: [1]
    
          template_vars:
             POST_INIT: |
                neighbor 1.0 bin
                box      tilt large
             POST_READ_DATA: |
                change_box all triclinic
    
      select:
        model_devi:
            f_trust_lo: 0.2
            f_trust_hi: 0.4
            asap_options: {}  # use default options
    
      update:
        walkthrough:
          table: []
    `,
    },
  ];
  const enviroments = [
    { name: 'v1', type: 'constant', value: '123' },
    {
      name: 'v2',
      type: 'ref',
      value: '1',
      children: [{ name: 'v3', type: 'path', value: './local/temp.dump' }],
    },
    { name: 'v3', type: 'path', value: './local/temp.dump' },
  ];
  return { files, enviroments };
}
